interface Project {
    id : number
    headline : string
    description : string
    techUsed1 : string
    techUsed2? : string
    techUsed3? : string
    techUsed4? : string
    techUsed5? : string
    techUsed6? : string
    timestamp : string
    repoUrl? : string
    developerId : number
  }
  
  interface Developer {
    id : number
    firstname : string
    lastname : string
    description : string
    githubUrl : string
    userId : number
    projects? : Project[]
  }

  interface DeveloperWithProjects extends Developer {
    projects?: Project[];
  }
  
  interface ApiData {
    content: {
      developers?: DeveloperWithProjects[]; // For multiple developers
      firstname?: string; // For a single developer
      lastname?: string;
      description?: string;
      githubUrl?: string;
      userId?: number;
      projects?: Project[]; 
    };
    error: string;
    fetched: boolean;
  }
  

  interface fetchSettings {
    method : string
    headers? : any
    body? : string
  }
  
  export type { ApiData, Developer, Project, fetchSettings }