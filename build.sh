if [ "$1" = "prod" ]; then
    yarn clear
    yarn tsc --build tsconfig.prod.json
else
    yarn tsc
fi