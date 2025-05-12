#!/bin/bash

echo "[1] Create dirs"
mkdir -p ./keys/raw
mkdir -p ./keys/single-line

echo "[2] Generate RSA keys"
openssl genpkey -algorithm RSA -out ./keys/raw/access_private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -in ./keys/raw/access_private_key.pem -pubout -out ./keys/raw/access_public_key.pem
openssl genpkey -algorithm RSA -out ./keys/raw/refresh_private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -in ./keys/raw/refresh_private_key.pem -pubout -out ./keys/raw/refresh_public_key.pem

echo "[3] Format keys to single line"
awk 'NF {sub(/\r/, ""); printf "%s\\n", $0;}' ./keys/raw/access_private_key.pem > ./keys/single-line/access_private_key.pem
awk 'NF {sub(/\r/, ""); printf "%s\\n", $0;}' ./keys/raw/access_public_key.pem > ./keys/single-line/access_public_key.pem
awk 'NF {sub(/\r/, ""); printf "%s\\n", $0;}' ./keys/raw/refresh_private_key.pem > ./keys/single-line/refresh_private_key.pem
awk 'NF {sub(/\r/, ""); printf "%s\\n", $0;}' ./keys/raw/refresh_public_key.pem > ./keys/single-line/refresh_public_key.pem

echo "[4] Read single line keys"
JWT_ACCESS_KEY_PRIVATE=$(cat ./keys/single-line/access_private_key.pem)
JWT_ACCESS_KEY_PUBLIC=$(cat ./keys/single-line/access_public_key.pem)
JWT_REFRESH_KEY_PRIVATE=$(cat ./keys/single-line/refresh_private_key.pem)
JWT_REFRESH_KEY_PUBLIC=$(cat ./keys/single-line/refresh_public_key.pem)

echo "[4] Create \"./keys/.env\" files"
cat <<EOF > ./keys/.env
JWT_ACCESS_KEY_PRIVATE="${JWT_ACCESS_KEY_PRIVATE}"
JWT_ACCESS_KEY_PUBLIC="${JWT_ACCESS_KEY_PUBLIC}"
JWT_REFRESH_KEY_PRIVATE="${JWT_REFRESH_KEY_PRIVATE}"
JWT_REFRESH_KEY_PUBLIC="${JWT_REFRESH_KEY_PUBLIC}"
EOF

echo "Done! ✅"
