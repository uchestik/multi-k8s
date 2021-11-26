docker build -t uchestik/fib-client:latest -t uchestik/fib-client:$SHA -f ./frontend/Dockerfile ./frontend
docker build -t uchestik/fib-server:latest -t uchestik/fib-server:$SHA -f ./server/Dockerfile ./server
docker build -t uchestik/fib-worker:latest -t uchestik/fib-worker:$SHA -f ./worker/Dockerfile ./worker

docker push uchestik/fib-client:latest
docker push uchestik/fib-server:latest
docker push uchestik/fib-worker:latest

docker push uchestik/fib-client:$SHA
docker push uchestik/fib-server:$SHA
docker push uchestik/fib-worker:$SHA

kubectl apply -f k8s
kubectl set image deployments/server-deployment server=uchestik/fib-server:$SHA
kubectl set image deployments/client-deployment client=uchestik/fib-client:$SHA
kubectl set image deployments/worker-deployment worker=uchestik/fib-worker:$SHA