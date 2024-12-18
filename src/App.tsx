import React, { useState } from 'react';
import './App.css';

interface ItemProps {
  id: number;
  description: string;
  quantity: number;
  packed: boolean;
}

type ListPropsArray = ItemProps[];

const initialItems: ListPropsArray = [];

function App() {
  const [items, setItems] = useState<ListPropsArray>(initialItems);

  function handleItem(item: ItemProps) {
    setItems((prevItems) => [...prevItems, item]);
  }

  function handleDelete(id: number) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItem(id: number) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItem={handleItem} />
      <PackagingList
        items={items}
        setItems={setItems}
        handleDelete={handleDelete}
        handleToggleItem={handleToggleItem}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>👜 Far Away 🌴</h1>;
}

interface FormProps {
  onAddItem: (item: ItemProps) => void;
}

function Form({ onAddItem }: FormProps) {
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [Error, setError] = useState<boolean>(false);


  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (description.trim() === '') {
      setError(true);
      return;
    }

    const newItem = { description, quantity, packed: false, id: Date.now() };
    onAddItem(newItem);
    setDescription(''); // Clear the input fields
    setQuantity(1);
    setError(false); // Reset error state after successful submission
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 👜 trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input className={Error?'inputtext':''}
        type="text"
        placeholder={Error?"please Add item in list":"Item..."}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      
      <button>Add</button>
      {/* <p  className='Error'> {}</p> */}
    </form>
   
  );
}

function PackagingList({ items, handleDelete, handleToggleItem,setItems }: any) {
  const[sortBy,setsortBy]=useState('input')
 function handleClear() {
  const confirm:any = window.confirm("Are you sure want to delete all itme")
  console.log(confirm,"nvfvj")
  if(confirm){
    setItems([])
  }
 
    
  }

  let sortedItem;
  if(sortBy==='input') {sortedItem=items}
  if(sortBy==='description'){ sortedItem=items.slice().sort((a:any,b:any)=>a.description.localeCompare(b.description))}
    if(sortBy==='packed'){sortedItem=items.slice().sort((a:any,b:any)=>Number(a.packed)-Number(b.packed))}

    console.log(sortedItem,"sdfd")
  return (
    <div className="list">

      <ul>
      {sortedItem.map((item: ItemProps) => (
        <Item
          item={item}
          key={item.id}
          handleDelete={handleDelete}
          handleToggleItem={handleToggleItem}
        />
      ))}
    </ul>

    <div className='actions'>
  {items.length > 0 && (
    <>
      <select value={sortBy} onChange={e => setsortBy(e.target.value)}>
        <option value="input">Sort by input Array</option>
        <option value="description">Sort by description</option>
        <option value="packed">Sort by packed status</option>
      </select>
      
    </>
  )}

{items.length>0 &&<button onClick={handleClear}>Clear All</button>}
    </div>
    </div>
    
    
  );
}

function Item({ item, handleDelete, handleToggleItem }: any) {
  return (
    <li>
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => handleToggleItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: 'line-through' } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => handleDelete(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }: any) {
  if (!items.length) {
    return (
      <p className="stats">
        <em>Start adding some items to your packing list 🚀</em>
      </p>
    );
  }

  const numItems = items.length;
  const numPacked = items.filter((item: ItemProps) => item.packed).length;
  const packedPercentage = numItems > 0 ? Math.round((numPacked / numItems) * 100) : 0;

  return (
    <footer className="stats">
      <em>
        {packedPercentage === 100
          ? 'You got everything! Ready to go--->>'
          : `👜 You have ${numItems} items on your list, and you already packed ${numPacked} (${packedPercentage}%)`}
      </em>
    </footer>
  );
}

export default App;
