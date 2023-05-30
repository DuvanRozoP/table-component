import { useCallback, useEffect, useMemo, useState } from 'react';
import BasicTable from './shared/Table/BasicTable';
import './App.css';

type usersType = {
  id: number;
  firstName: string;
  email: string;
  university: string;
  gender: 'male' | 'female';
  age: number;
};

function App() {
  const [users, getUsers] = useState<usersType[]>();
  const [loading, isLoading] = useState<boolean>(true);
  const [genderFilter, setGenderFilter] = useState<string>('todo');
  const [ageFilter, setAgeFilter] = useState<string>('');
  const [visibleUsers, setVisibleUsers] = useState<number>(5);

  const applyFiltersAndSorting = useCallback(
    (users: usersType[]): usersType[] => {
      return users
        .filter(user => {
          if (genderFilter === 'female') return user.gender === 'female';
          else if (genderFilter === 'male') return user.gender === 'male';

          return true;
        })
        .sort((a, b) => {
          if (ageFilter === 'asc') return a.age - b.age;
          else if (ageFilter === 'desc') return b.age - a.age;

          return 0;
        });
    },
    [genderFilter, ageFilter],
  );

  const handleGFenderFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGenderFilter(event.target.value);
  };
  const handleAgeClick = () => {
    if (ageFilter === 'asc') setAgeFilter('desc');
    else setAgeFilter('asc');
  };

  useEffect(() => {
    fetch('https://dummyjson.com/users')
      .then(response => response.json())
      .then(({ users }) => {
        getUsers(users);
        isLoading(false);
      })
      .catch(error => {
        alert('error al conectar con la Api: ' + error.message);
      });
  }, []);

  const filteredUsers = useMemo(
    () => users && users.slice(0, visibleUsers),
    [users, visibleUsers],
  );
  const viewUsers = useMemo(
    () => applyFiltersAndSorting(filteredUsers || []),
    [applyFiltersAndSorting, filteredUsers],
  );
  const Columns = ['', 'Name', 'Email', 'University', 'Gender', 'Age'];
  if (loading) return <p>loading...</p>;
  if (!users || !users.length) return <p>No se encontraron usuarios</p>;

  return (
    <>
      <select value={genderFilter} onChange={handleGFenderFilter}>
        <option value="">all</option>
        <option value="male">male</option>
        <option value="female">female</option>
      </select>
      <BasicTable
        columns={Columns}
        rows={viewUsers.map(user => [
          user.id.toString(),
          user.firstName,
          user.email,
          user.university,
          user.gender,
          user.age.toString(),
        ])}
        actions={[
          {
            nameColumn: 'Age',
            payload: handleAgeClick,
          },
        ]}
      />

      {visibleUsers < users.length && (
        <button onClick={() => setVisibleUsers(visibleUsers + 5)}>
          Cargar más
        </button>
      )}
    </>
  );
}

export default App;
