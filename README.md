# 💻 Development Environment

```bash
# install pnpm
npm install -g pnpm

# install dependencies
pnpm install

# run the project
pnpm serve
```

# ⚙️ Docker Deploy

```bash
# build image
docker build -t tyxuan-web-template --build-arg BACKEND_URL=http://192.168.123.200:8080 .

# run container
docker run -d --name tyxuan-web-template -p 80:80 tyxuan-web-template
```

Website URL : `http://localhost`
#   F E T y B a c h  
 