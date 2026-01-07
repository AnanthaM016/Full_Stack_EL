pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "anantha15"
        BACKEND_IMAGE  = "anantha15/teamfinder-backend"
        FRONTEND_IMAGE = "anantha15/teamfinder-frontend"
        K8S_NAMESPACE  = "teamfinder"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t $BACKEND_IMAGE:$BUILD_NUMBER backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $FRONTEND_IMAGE:$BUILD_NUMBER frontend'
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
                        docker push $BACKEND_IMAGE:$BUILD_NUMBER
                        docker push $FRONTEND_IMAGE:$BUILD_NUMBER
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl set image deployment/backend backend=$BACKEND_IMAGE:$BUILD_NUMBER -n $K8S_NAMESPACE
                    kubectl set image deployment/frontend frontend=$FRONTEND_IMAGE:$BUILD_NUMBER -n $K8S_NAMESPACE
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment completed successfully"
        }
        failure {
            echo "❌ Deployment failed"
        }
    }
}
