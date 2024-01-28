#!/bin/bash

# Replace these variables with your actual values
REMOTE_USER="your_remote_user"
REMOTE_HOST="your_remote_host"
REMOTE_DIR="your_remote_directory"

# REMOTE_USER: اسم المستخدم الذي ستقوم بتسجيل الدخول به عن بُعد إلى خادم VPS. يمكن أن يكون مثل "root" أو "ubuntu" أو أي مستخدم آخر لديك على VPS.

# REMOTE_HOST: عنوان IP أو اسم المضيف (hostname) لخادم VPS الخاص بك. مثال: "123.456.789.0" أو "example.com".

# REMOTE_DIR: المسار على VPS حيث ستقوم بتحميل وفك ضغط المشروع. يمكن أن يكون مسارًا كاملاً مثل "/var/www/myapp" أو أي مجلد آخر حسب هيكل الملفات الخاص بك.

# الآن، لنقدم مثال على كيفية استخدام هذه المتغيرات في مشروعك. لنفترض أن لديك VPS مع مستخدم يسمى "ubuntu"، وعنوان IP هو "123.456.789.0"، وتريد نشر مشروعك في المجلد "/var/www/calmaserver" على الخادم. في هذه الحالة، سيكون لديك:

# REMOTE_USER="ubuntu"
# REMOTE_HOST="123.456.789.0"
# REMOTE_DIR="/var/www/calmaserver"


# Build your project
npm install
npm run build

# Tar the project (excluding node_modules and other unnecessary files)
tar --exclude='./node_modules' --exclude='./.git' -zcvf project.tar.gz .

# Upload the tar file to the VPS
scp -r project.tar.gz $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR

# Connect to the VPS and deploy the project
ssh $REMOTE_USER@$REMOTE_HOST << 'ENDSSH'
  cd $REMOTE_DIR

  # Extract the project
  tar -zxvf project.tar.gz

  # Install production dependencies
  npm install --production

  # Restart the Node.js process (you may need to adjust this based on your setup)
  pm2 restart your_app_name
ENDSSH

# Clean up local files
rm project.tar.gz
