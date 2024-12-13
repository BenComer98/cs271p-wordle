import os

# Number of worker processes
workers = int(os.environ.get('GUNICORN_PROCESSES', '1'))
threads = int(os.environ.get('GUNICORN_THREADS', '2'))

# Bind to port with HTTPS
bind = os.environ.get('GUNICORN_BIND', '0.0.0.0:8443')

# Paths to self-signed certificates
certfile = '/etc/ssl/certs/selfsigned.crt'
keyfile = '/etc/ssl/private/selfsigned.key'

# Forward HTTP scheme headers for proper HTTPS routing
forwarded_allow_ips = '*'
secure_scheme_headers = {'X-Forwarded-Proto': 'https'}

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'