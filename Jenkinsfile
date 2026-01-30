pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "anantha15"
        BACKEND_IMAGE  = "anantha15/teamfinder-backend"
        FRONTEND_IMAGE = "anantha15/teamfinder-frontend"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                    docker build -t $BACKEND_IMAGE:latest backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    docker build -t $FRONTEND_IMAGE:latest frontend
                '''
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push $BACKEND_IMAGE:latest
                        docker push $FRONTEND_IMAGE:latest
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Images built and pushed successfully"
        }
        failure {
            echo "❌ CI pipeline failed"
        }
    }
}
