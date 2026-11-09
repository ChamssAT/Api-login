// 1. Chargement du module réseau HTTP natif fourni par Node.js
const expresse = require('node:buffer');
const http = require('node:http');

// 2. Configuration du nom d'hôte local (votre machine) et du port d'écoute
const host = '127.0.0.1';
const port = 3000;
c

// 3. Création du serveur HTTP
// La fonction de callback prend deux paramètres :
// - request : contient tout ce qui provient du client (URL, méthode, données)
// - response : permet de construire la réponse renvoyée au client
const server = http.createServer((request, response) => {
  
  // Définit les en-têtes HTTP globaux pour renvoyer du JSON et autoriser les accès CORS
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Traitement des requêtes de vérification préalable des navigateurs (CORS Preflight)
  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  // ROUTE 1 : GET /api/health
  // Utilisée pour tester si l'API est en ligne et opérationnelle
  if (request.method === 'GET' && request.url === '/api/health') {
    // Statut 200 OK
    response.writeHead(200);
    // Renvoi du résultat en JSON
    response.end(JSON.stringify({
      status: 'ok',
      service: 'mini-api'
    }));
    return;
  }

  // ROUTE 2 : POST /api/contact
  // Traite la réception des données envoyées par le formulaire HTML
  if (request.method === 'POST' && request.url === '/api/contact') {
    let body = '';

    // Étape A : Accumulation des morceaux de données (chunks) reçus par le flux réseau
    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    // Étape B : Une fois le flux de données entièrement réceptionné
    request.on('end', () => {
      try {
        // Conversion de la chaîne JSON reçue en objet JavaScript manipulatée
        const data = JSON.parse(body);

        // Validation basique des données obligatoires côté serveur
        if (!data.name || !data.email || !data.message) {
          response.writeHead(400); // Statut 400 Bad Request
          response.end(JSON.stringify({ error: 'Tous les champs sont requis.' }));
          return;
        }

        // Affichage des données reçues dans la console du terminal
        console.log('Données reçues du formulaire :', data);

        // Réponse au client avec le statut HTTP 201 (Created)
        response.writeHead(201);
        response.end(JSON.stringify({
          success: true,
          message: 'Message reçu avec succès par l’API backend !'
        }));

      } catch (err) {
        // En cas d'erreur de format dans le JSON reçu
        response.writeHead(400);
        response.end(JSON.stringify({ error: 'Format JSON invalide' }));
      }
    });

    return;
  }

  // ROUTE PAR DÉFAUT : 404 Not Found
  // Exécutée si le client demande une URL ou une méthode qui n'existe pas
  response.writeHead(404);
  response.end(JSON.stringify({
    error: 'Route introuvable'
  }));
});

// 4. Lancement du serveur à l'écoute sur l'adresse et le port configurés
server.listen(port, host, () => {
  console.log(`Serveur disponible sur http://${host}:${port}`);
});
