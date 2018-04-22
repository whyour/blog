#!/bin/sh
rsync -rvz -e 'ssh -p 29219' --progress -a ./public root@45.62.111.236:/makerBlog
