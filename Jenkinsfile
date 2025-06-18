pipeline {
  agent any

  environment {
    DOCKER_IMAGE_BACKEND = 'yourdockerhubuser/backend:latest'
    DOCKER_IMAGE_FRONTEND = 'yourdockerhubuser/frontend:latest'
    EC2_HOST = 'your-ec2-ip'
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
        sh """
        ssh -i $SSH_KEY $EC2_USER@$EC2_HOST << 'EOF'
          docker pull $DOCKER_IMAGE_BACKEND
          docker pull $DOCKER_IMAGE_FRONTEND
          docker stop backend || true
          docker rm backend || true
          docker stop frontend || true
          docker rm frontend || true
          docker run -d --restart unless-stopped -p 3001:3001 --name backend $DOCKER_IMAGE_BACKEND
          docker run -d --restart unless-stopped -p 80:3000 --name frontend $DOCKER_IMAGE_FRONTEND
        EOF
        """
      }
    }
  }
}
