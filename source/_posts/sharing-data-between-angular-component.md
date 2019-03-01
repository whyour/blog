---
title: Angular6 组件之间数据通信
date: 2018-11-18 16:27:11
tags: [angular, component, angular6]
---
在本篇中，将介绍基本的父子组件、兄弟组件、任意组件之间的数据通信方式。

### Parent to Child via Input Decorator

父组件向子组件传递数据的时候，可以使用在子组件中使用`Input Decorator`，这样在父组件中就可以通过模板传递给子组件。

```typescript
// parent.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <app-child [childMessage]="parentMessage"></app-child>
  `,
  styleUrls: ['./parent.component.css']
})
export class ParentComponent {
  public parentMessage = "message from parent";
  constructor() { }
}

```

```typescript
// child.component.ts

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
      Say {{ message }}
  `,
  styleUrls: ['./child.component.css']
})
export class ChildComponent {

  @Input() childMessage: string;

  constructor() { }

}

```

### Child to Parent via ViewChild

ViewChild 允许将一个组件注入另一个组件，使父组件可以访问其属性和功能。但有一点需要注意的是，在视图初始化之后，子组件才可用。这意味着我们需要实现 AfterViewInit 生命周期钩子来接收来自子组件的数据。

```typescript
// parent.component.ts

import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ChildComponent } from "../child/child.component";

@Component({
  selector: 'app-parent',
  template: `
    Message: {{ message }}
    <app-child></app-child>
  `,
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements AfterViewInit {

  @ViewChild(ChildComponent) child;

  public message: string;

  constructor() { }

  ngAfterViewInit(): void {
    this.message = this.child.message;
  }
}

```

```typescript
// child.component.ts

import { Component} from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
  `,
  styleUrls: ['./child.component.css']
})
export class ChildComponent {

  public message = 'Hello World!';

  constructor() { }

}
```

### Child to Parent via Output and EventEmitter

子组件还可以通过`emit`的方式将数据广播出去，这样可以在子组件需要通过事件触发来传递数据到父组件。

```typescript
// parent.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    Message: {{message}}
    <app-child (messageEvent)="receiveMessage($event)"></app-child>
  `,
  styleUrls: ['./parent.component.css']
})
export class ParentComponent {

  public message: string;

  constructor() { }

  receiveMessage($event): void {
    this.message = $event;
  }
}

```

```typescript
// child.component.ts

import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
      <button (click)="sendMessage()">Send Message</button>
  `,
  styleUrls: ['./child.component.css']
})
export class ChildComponent {

  public message: string = "Hello World!";

  @Output() messageEvent = new EventEmitter<string>();

  constructor() { }

  sendMessage(): void {
    this.messageEvent.emit(this.message);
  }
}

```

### Share data between any components

当组件间没有直接的关系的时候，我们可以创建一个共享服务，然后通过`Rxjs`中的`BehaviorSubject`来存储数据，这样每个组件通过订阅这个数据，当这个数据发生变化的时候，都可以获得最新的数据。

```typescript
// data.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  public currentMessage = new BehaviorSubject<string>('default message');

  constructor() { }

  changeMessage(message: string): void {
    this.messageSource.next(message);
  }

}

```

```typescript
// parent.component.ts

import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'app-parent',
  template: `
    {{message}}
  `,
  styleUrls: ['./sibling.component.css']
})
export class ParentComponent implements OnInit {

  public message: string;

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message => this.message = message);
  }

}

```

```typescript
// siblings.component.ts

import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'app-sibling',
  template: `
    {{message}}
    <button (click)="newMessage()">New Message</button>
  `,
  styleUrls: ['./sibling.component.css']
})
export class SiblingComponent implements OnInit {

  public message: string;

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(message => this.message = message);
  }

  newMessage(): void {
    this.data.changeMessage("Hello from Sibling");
  }

}

```

### Other Library For Angular State Management

[ngrx](https://github.com/ngrx/platform)