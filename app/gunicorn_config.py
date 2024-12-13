import os

# Number of worker processes
workers = int(os.environ.get('GUNICORN_PROCESSES', '1'))
threads = int(os.environ.get('GUNICORN_THREADS', '2'))

# Port and bind address
# Gunicorn will bind to 0.0.0.0:443 to listen for HTTPS traffic
bind = os.environ.get('GUNICORN_BIND', '0.0.0.0:8443')

# Forward HTTP scheme headers for proper HTTPS routing
forwarded_allow_ips = '*'
secure_scheme_headers = {'X-Forwarded-Proto': 'https'}

# Enable access logs (optional but recommended)
accesslog = '-'
errorlog = '-'
loglevel = 'info'