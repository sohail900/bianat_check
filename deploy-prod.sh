#!/bin/bash
set -e
echo -e "
    Creating a new build...
"
git checkout main
yarn install
yarn build

echo -e "
    Copying Build to Production Server...
"

cd build
tar -a -c -f build.zip *

scp -r build.zip imran@34.135.177.8:/home/developer/bianat-client

echo -e "
    Deploying to Production Server...
"

ssh imran@34.135.177.8 <<EOF
sudo su
cd /home/developer/bianat-client
rm -rf build
mkdir build
tar -xvmf build.zip -C build
rm -f build.zip
exit
EOF

echo -e "
    Deployment Complete on Production Server!
"
echo -e "
    Press Enter to quit....
"

read junk
