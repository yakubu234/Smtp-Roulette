Install Supervisor globally if you haven't already:

npm install -g supervisor


Create a configuration file for your worker script. Create a file named worker.conf with the following content:

[program:worker]
command=/path/to/node /path/to/worker.js
autostart=true
autorestart=true
stderr_logfile=/var/log/worker.err.log
stdout_logfile=/var/log/worker.out.log


Adjust the paths as necessary.

Start the worker process using Supervisor:

supervisorctl reread
supervisorctl update
supervisorctl start worker
