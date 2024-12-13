import os

# Number of worker processes
workers = int(os.environ.get('GUNICORN_PROCESSES', '1'))
threads = int(os.environ.get('GUNICORN_THREADS', '2'))

# Port and bind address
# Gunicorn will bind to 0.0.0.0:443 to listen for HTTPS traffic
bind = os.environ.get('GUNICORN_BIND', '0.0.0.0:443')

# Path to SSL certificate files
# Make sure you have SSL certificate files ready (cert.pem and key.pem)
ssl_certfile = os.environ.get('SSL_CERTFILE', '/path/to/your/cert.pem')
ssl_keyfile = os.environ.get('SSL_KEYFILE', '/path/to/your/key.pem')

# Forward HTTP scheme headers for proper HTTPS routing
forwarded_allow_ips = '*'
secure_scheme_headers = {'X-Forwarded-Proto': 'https'}

# Enable access logs (optional but recommended)
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# Bind Gunicorn with SSL
cert_enabled = os.environ.get('ENABLE_SSL', 'false').lower() == 'true'

if cert_enabled:
    bind = f"0.0.0.0:443"
    ssl_options = {
        'certfile': ssl_certfile,
        'keyfile': ssl_keyfile
    }
    print(f"Using SSL certificates at {ssl_certfile} and {ssl_keyfile}")
else:
    print("Running without SSL")