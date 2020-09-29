# Serverless like button

## Live example

http://18.231.192.14/

## Observations

  - Why I choose FaunaDB instead a key-value database to store likes?

    Because I also think in the context of the articles, to be able to store title, description, etc.

  - I was not able to configure the task as auto scaling (not yet)

## Requirements

  - You must have a account in https://dashboard.fauna.com/
  - You must have a account in AWS (console.aws.amazon.com) [The free tier account is enough]
  - Have a docker hub account

## Prepare database and functions

1. Install the serverless framework
  ```
    npm install serverless -g
  ```

2. Clone down the repository
  ```
    git clone https://github.com/CleitinIF/like-button-functions.git
  ```

3. Enter the functions repository
  ```
    cd like-button-functions
  ```

4. Install the dependencies
  ```
    npm install
  ```

5. Sign up or Log in for a FaunaDB account
  ```https://dashboard.fauna.com/accounts/register```

6. Create a database
    
    In the Fauna Cloud Console:
    - Click “New Database”
    - Enter “rock-content” as the “Database Name”
    - Click “Save”

7. Create a database access key

    In the Fauna Cloud Console:
    - Click “Security” in the left navigation
    - Click “New Key”
    - Make sure that the “Database” field is set to “rock-content”
    - Make sure that the “Role” field is set to “Admin”
    - Enter “AWS” as the “Key Name”
    - Click “Save”

8. Copy the database access key’s secret

    Save the secret somewhere safe; you won’t get a second chance to see it.

9. Set your database access secret

    - In your terminal, run the following command:

    ```
      export FAUNADB_SECRET=YourFaunaDBSecretHere
    ```

    Replace YourFaunaDBSecretHere with the value of the secret that you copied in the previous step.

    - In serverless.yml file, replace the FAUNADB_SECRET in environment section with the value of the secret that you copied.


10. Bootstrap your FaunaDB collection and indexes
    ```
      npm run setup-database
    ```

11. Configure a User in Identity and Access Management (IAM)

    - In the AWS console, open the IAM dashboard
    - Click the **Add User** button
    - Enter "serverless" as the **User name** field
    - Check **Programmatic access** in access type config
    - Click **Next**
    - Select **Attach existing policies directly** and Check the **AdministratorAccess** policy
    - Click **Next**
    - Click **Next**
    - And click **Create User**
    - Save the **Access key ID** and **Secret access key** somewhere safe; you won’t get a second chance to see Secret access key.

12. Configure credentials in serverless cli

    - In your terminal, run the following command:
    ```
      serverless config credentials -o --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_ACCESS_KEY
    ```
      Replace variables with the values that you copied in the previous step.

13. Deploy your functions to AWS

    - In your terminal, run the following command:
    ```
      serverless deploy
    ```

    After the command is finished, look for the **endpoints** log and make a request to .../getpost/1

## Prepare frontend environment

1. Clone down the repository
  ```
    git clone https://github.com/CleitinIF/like-button-web.git
  ```

3. Enter the frontend repository
  ```
    cd like-button-web
  ```

4. Install the dependencies
  ```
    npm install
  ```

5. Set your api BaseUrl

    Replace REACT_APP_API_URL in .env with the base url of your lambda functions (see the last step in the ***Prepare database and functions***)

6. Build and publish a docker image

    - Login into your docker registry account

  ```
    docker login --username=YOUR_DOCKER_USERNAME --password=YOUR_DOCKER_PASSWORD
  ```

  - Build your image

  ```
    docker build -t your_account_name/like-button-web:latest .
  ```

  - Push your image

  ```
    docker push your_account_name/like-button-web:latest
  ```

7. Create your Task in AWS

    - In the AWS console, open the ECS dashboard
    - Click on **Task Definitions** on the left side
    - Click **Create new Task Definition**
    - Select **EC2** launch type and click **Next step**
    - Set "like-button-task" as the **Task Definition Name** field
    - Enter "512" in **Task memory** and **Task CPU** field
    - Click **Add container**
    - Enter "like-button-container" in **Container name** field
    - Enter you image name in **Image** field, like your_account_name/like-button-web:latest
    - Set "80" in **Host port** and **Container port**
    - Click on **Add** button to finish container creation
    - Click on **Create** button to finish task creation

8. Create and configurate your cluster

    In the ECS dashboard:
    - Click on **Create Cluster**
    - Select **EC2 Linux + Networking** and click **Next step**
    - Enter "like-button-cluster" in **Cluster name**
    - In Instance configuration, select t2.micro on **EC2 instance type**
    - Keep the **number of instances** as 1
    - Click **Create**
    - After creating the cluster, open it and click on **Create** in **Services** panel
    - Check EC2 in **Launch type**
    - Select you task and cluster
    - Enter 'like-button-service' in **Service name**
    - Set **Number of tasks** as 1
    - Click on **Next step**
    - Click on **Next step**
    - Click on **Next step**
    - Click on **Create Service**
    - Go back to like-button-cluster page and click on **EC2 instances**
    - Click on the only instance available
    - Copy **Public IP**
    - In your **like-button-functions** repository, open the serverless.yml
    - Replace the **ORIGIN_ADDRESS** in your environment configuration with the value that you copied.
    - Open the copied ip in your browser and Enjoy it
