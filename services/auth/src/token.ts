/*
 * Let's figure out why each service requires access to the user and instance details
 *
 * Engine
 *  - To generate a visualization
 *  - References to the chat-bot flow
 *
 * Mediator
 *  - To connect to the specific instance and provide a gateway (Should we bypass this? It seems like it may be redundant since we can use PAT to directly access the DHIS2 instance)
 *
 * Messaging
 *  - Figure out configuration for the client
 *
 * Plan for approaching this implementation:
 *
 *  1. Collect the following info about the token:
 * 			 - id
 * 			 - expire time
 *  		 - session  - Generated to ensure access as the user who generated the token - (Tryout if parse allows more than one active session)
 * 			 - instanceId - ID of the DHIS2 instance that will be using
 * 	2. Create a AuthToken object with those fields.
 *  3. Generate a jwt token from those fields
 *  4. Share to the user
 *  5. Save the AuthToken
 *
 *
 *  How do services use this token:
 *
 * 	Whenever a service has a request, the generated token should be in the headers (header can be `token` for now. )
 *   - The service then gets the AuthToken from the token by verifying the token
 *   - The service then uses the session token from the payload to become the user requesting the service (https://parseplatform.org/Parse-SDK-JS/api/4.0.1/Parse.User.html#.become)
 *   - From here on the service can request any of the data/services it requires from the auth system
 *   - If a service requires a service from any of the other service, it should request while passing down the token.
 *
 *  Notes:
 *   - Handle token error issues as early as possible. Preferably in the proxy service. A token should only be passed down if it is correct
 *   -

 * */
