#!/bin/bash

set -e

echo -e "
    Creating a new build...
"
git checkout dev-clone-new
yarn install
yarn build

echo -e "
    Copying Build to Dev Server...
"

cd build
tar -a -c -f build.zip *

scp -r build.zip imran@35.188.102.131:/home/developer/bianat-frontend-new

echo -e "
    Deploying to Dev Server...
"

ssh imran@35.188.102.131 <<EOF
sudo su
cd /home/developer/bianat-frontend-new
rm -rf build
mkdir build
tar -xvmf build.zip -C build
rm -f build.zip
exit
EOF

echo -e "
    Deployment Complete to Dev Server!
"
echo -e "
    Press Enter to quit....
"

read junk
