# Instalar Firebase CLI
`
npm install -g firebase-tools
`
# Inicializa el proyecto
## Autenticar Firebase CLI
`
firebase login
firebase login --reauth
`
## Inicializar Cloud Firestore
`
firebase init firestore
`
## Inicializar Cloud Functions
`
firebase init functions
`
## Ejecutar en el emulador
`
firebase emulators:start
`
## Desplegar Cloud Functions
`
firebase deploy --only functions
`
## Problemas de permisos
`
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudbuild.googleapis.com
`

