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
### Listar funciones para actualizar permisos
`
gcloud functions list --project dp-project-q01
`
### Dar permisos con gcloud
`
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudbuild.googleapis.com
`

firebase functions:secrets:set DP_PROJECT_01_API_KEY
firebase functions:secrets:get DP_PROJECT_01_API_KEY
echo -n "VALOR_DEL_SECRETO" | firebase functions:secrets:set DP_PROJECT_01_API_KEY

## Agregar entornos (qa y pprd)
firebase use --add

## Usar entornos (qa y pprd)
firebase use qa
