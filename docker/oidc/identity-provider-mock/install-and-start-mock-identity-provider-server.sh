# Download node version manager (nvm).
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Load nvm.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm install v18.16.0

npm install -g @mongodb-js/oidc-mock-provider@0.6.0

touch ./mock-identity-provider-server.log

# Start the server in the background logging to a file.
oidc-mock-provider --port 28200 --host="0.0.0.0" --bind_host &> ./mock-identity-provider-server.log &

# Wait for the server to start, when it starts it emits 404.
while ! bash -c "curl -I http://localhost:28200 | grep 404"; do                      
  sleep 0.5
done
