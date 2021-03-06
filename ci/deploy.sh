#! /usr/bin/env bash

source ${BASH_SOURCE%/*}/_colors.sh
source ${BASH_SOURCE%/*}/smoke_test.sh

set -e

e_header "Deploying backend"
pushd backend

e_step "Build Docker container"
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"
docker build -t hamvocke/doppelkopf .
e_mute "Done"

e_step "Push Docker container"
docker push hamvocke/doppelkopf:latest
e_mute "Done"

e_step "Start Docker container"
scp -o StrictHostKeyChecking=no docker-compose.yml root@ham.codes:/data/doppelkopf_backend/docker-compose.yml
ssh -T root@ham.codes -o StrictHostKeyChecking=no << EOF
    cd /data/doppelkopf_backend
    docker-compose pull
    docker-compose up -d
EOF
e_mute "Done"


e_header "Deploying frontend"
popd

e_step "Upload static content..."
rsync -rvz --quiet --delete-after frontend/dist/ root@ham.codes:/tmp/doppelkopf -e "ssh -o StrictHostKeyChecking=no"
e_mute "Done"

e_step "Archive old website, activate current version"
ssh -T root@ham.codes << EOF
    rm -rf /data/archive/doppelkopf_bak/
    mkdir -p /data/archive && mv /data/doppelkopf/ /data/archive/doppelkopf_bak/
    mv /tmp/doppelkopf/ /data/doppelkopf
    aws s3 sync /data/doppelkopf/ s3://devbox-bucket.ham.codes/doppelkopf/
EOF
e_mute "Done"


e_step "Smoke tests..."
sleep 5
smoke_test https://doppelkopf.ham.codes
smoke_test https://doppelkopf.ham.codes/api/
e_mute "Done"

e_success "Done. All good."
