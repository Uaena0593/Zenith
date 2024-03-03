import React from 'react'

interface User{
  id: number;
  name: string;
}

const NewUserPage = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', 
  //if you have data that frequently changes, you do not want nextjs to autocache
  { cache: 'no-store' })
  //{next: { revalidate: 10 } } right here it will refresh the data from the backend every ten seconds
  //can pass in the type for the users using the interface  
  const users: User[] = await res.json();
  return (
    <>
      <div>NewUserPage</div>

      <p>{new Date().toLocaleTimeString()}</p>
      <ul>
        {users.map(user => <li key = {user.id}>{user.name}</li>)}  
      </ul>
    </>

  )
}

export default NewUserPage