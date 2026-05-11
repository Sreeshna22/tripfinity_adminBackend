module.exports = {
  apps: [
    {
      name: "tripfinity-api",       
      script: "./server.js",        
      instances: "max",             
      exec_mode: "cluster",         
      watch: false,                 
      max_memory_restart: "1G",     
      env_production: {
        NODE_ENV: "production",
      }
    }
  ]
};
