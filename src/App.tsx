import './styles.css';
import AutoComplete from './AutoComplete';

export default function App() {
  const suggestions = [
    'Apple',
    'AppleDoe',
    'AppleDoe2',
    'AppleDoe3',
    'Banana',
    'Cherry',
    'Date',
    'Elderberry',
    'Fig John Doe',
    'Grape',
    'Honeydewgg',
    'Honeydew hello',
    'Honeydew john'
  ];

  return (
    <div className="App">
      <AutoComplete suggestions={suggestions} />
    </div>
  );
}
