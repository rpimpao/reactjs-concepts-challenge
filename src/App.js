import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [ repositories, setRepositories ] = useState([]);

  // Get all repositories from BE when the Component is rendered on screen
  useEffect(() => {
    api.get('repositories').then(response => {
      const repos = response.data;
      setRepositories(repos);
    });
  }, []);

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: `Desafio Conceitos ReactJS ${Date.now()}`,
      url: "https://github.com/rpimpao/reactjs-concepts-challenge",
      techs: ["ReactJS", "NodeJS"]
    });

    const repo = response.data;
    setRepositories([...repositories, repo]);
  }

  async function handleRemoveRepository(id) {
    const repoIndex = repositories.findIndex(entry => entry.id === id);

    if (repoIndex >= 0) {
      const response = await api.delete(`repositories/${id}`);

      if (response.status === 204) {
        // Successfully deleted on the BE
        const repos = [...repositories];
        repos.splice(repoIndex, 1);
        setRepositories(repos);
      }
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {
          repositories.map(repo => {
            return <li key={repo.id}>
              {repo.title}
              <button onClick={() => handleRemoveRepository(repo.id)}>
                Remover
              </button>
            </li>
          })
        }
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
