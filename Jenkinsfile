pipeline {
    agent {
        docker {
            image 'node:latest' 
            args '-p 4200:80 -p 8999:8999 -p 3000:3000 -u 0:0' 
        }
    }
    environment {
        // Override HOME to WORKSPACE
        HOME = "${WORKSPACE}"
        // or override default cache directory (~/.npm)
        NPM_CONFIG_CACHE = "${WORKSPACE}/.npm"
    }
    stages {
        stage('Installing required global packages'){
            steps{
                sh 'npm install @angular/cli tsc -g'
            }
        }
        stage('Build Angular Application') { 
            steps {
                sh 'cd public && npm install --include=dev && ng build --prod'
            }
        }
        stage('Build ExpressTS') { 
            steps {
                sh 'cd app-socketAB && npm install --include=dev && npm run build'
            }
        }
        stage('Build ExpressJS') { 
            steps {
                sh 'cd app && npm install --include=dev && node ./app.js'
            }
        }
    }
}