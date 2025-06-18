pipeline {
  agent any

  environment {
    DOCKER_IMAGE_BACKEND = 'mayur2808/backend:latest'
    DOCKER_IMAGE_FRONTEND = 'mayur2808/frontend:latest'
    EC2_HOST = 'ec2-54-221-16-94.compute-1.amazonaws.com'
    EC2_USER = 'ubuntu'
    SSH_KEY = credentials('ec2-key')
    DOCKERHUB_CRED = credentials('dockerhub-creds')
  }

  stages {
    stage('Build Images') {
      steps {
        sh 'docker build -t $DOCKER_IMAGE_BACKEND ./backend'
        sh 'docker build -t $DOCKER_IMAGE_FRONTEND ./frontend'
      }
    }

    stage('Push Images') {
      steps {
        sh """
          echo "$DOCKERHUB_CRED_PSW" | docker login -u "$DOCKERHUB_CRED_USR" --password-stdin
          docker push $DOCKER_IMAGE_BACKEND
          docker push $DOCKER_IMAGE_FRONTEND
        """
      }
    }

    stage('Deploy on EC2') {
      steps {
        sshagent(credentials: ['ec2-key']) {
          sh """
            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} << 'EOF'
echo "✅ Connected to EC2 instance"

echo "🧼 Cleaning up old containers..."
docker rm -f backend || true
docker rm -f frontend || true

echo "⬇️ Pulling latest Docker images..."
docker pull $DOCKER_IMAGE_BACKEND
docker pull $DOCKER_IMAGE_FRONTEND

echo "🚀 Starting new containers with updated ports..."
docker run -d --name backend -p 8081:8080 $DOCKER_IMAGE_BACKEND
docker run -d --name frontend -p 3000:3000 $DOCKER_IMAGE_FRONTEND

echo "✅ Deployment complete! Running containers:"
docker ps
EOF
          """
        }
      }
    }
  }
}
