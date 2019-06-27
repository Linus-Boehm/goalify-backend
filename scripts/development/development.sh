#!/usr/bin/env bash
set -o errexit
set -o pipefail
#set -o nounset

WORKING_DIR="$(pwd)"

# Start mongodb
echo "Starting mongodb..."
mongod --fork -f /etc/mongod.conf --bind_ip 0.0.0.0 #--dbpath /usr/app/db-data

echo "Create database 'goalifydb'"
mongo <<EOF
    use goalifydb
    db.createCollection("test")
EOF

/bin/bash