pipeline {
    agent {
        docker {
            image 'node:latest' 
            args '-p 4200:80 -p 8999:8999 -p 3000:3000' 
        }
    }
    stages {
        stage('Build Angular Application') { 
            steps {
                sh 'cd public && npm install' 
                sh 'cd ../' 
            }
        }
        stage('Build ExpressTS') { 
            steps {
                sh 'cd app-socketAB && npm install' 
                sh 'cd ../' 
            }
        }
        stage('Build ExpressJS') { 
            steps {
                sh 'cd app && npm install' 
                sh 'cd ../' 
            }
        }
    }
}