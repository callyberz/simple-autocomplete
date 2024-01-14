import React, { useState, useEffect, KeyboardEvent } from 'react';
import useDebounce from './useDebounce';

interface AutocompleteProps {
  suggestions: string[];
}

const Autocomplete = ({ suggestions }: AutocompleteProps) => {
  const [userInput, setUserInput] = useState<string>('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] =
    useState<number>(-1);
  const debouncedSearchTerm = useDebounce<string>(userInput, 500);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setFilteredSuggestions([]);
      return;
    }
    const filtered = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  }, [debouncedSearchTerm, suggestions]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.currentTarget.value);
    setActiveSuggestionIndex(-1);
  };

  const onClick = (e: React.MouseEvent<HTMLLIElement>) => {
    setUserInput(e.currentTarget.innerText);
    setFilteredSuggestions([]);
    setActiveSuggestionIndex(-1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Ensure the index is within the bounds of the filteredSuggestions array
      if (
        activeSuggestionIndex >= 0 &&
        activeSuggestionIndex < filteredSuggestions.length
      ) {
        setUserInput(filteredSuggestions[activeSuggestionIndex]);
        setFilteredSuggestions([]);
        setActiveSuggestionIndex(-1);
      }
    } else if (e.key === 'ArrowUp') {
      setActiveSuggestionIndex(
        activeSuggestionIndex <= 0 ? 0 : activeSuggestionIndex - 1
      );
    } else if (e.key === 'ArrowDown') {
      setActiveSuggestionIndex(
        activeSuggestionIndex >= filteredSuggestions.length - 1
          ? filteredSuggestions.length - 1
          : activeSuggestionIndex + 1
      );
    }
  };

  const SuggestionsListComponent = () => {
    return filteredSuggestions.length ? (
      <ul className="suggestions">
        {filteredSuggestions.map((suggestion, index) => {
          const startIndex = suggestion
            .toLowerCase()
            .indexOf(debouncedSearchTerm.toLowerCase());
          const endIndex = startIndex + debouncedSearchTerm.length;
          return (
            <li
              key={index}
              onClick={onClick}
              className={index === activeSuggestionIndex ? 'active' : ''}
            >
              {suggestion.substring(0, startIndex)}
              <span className="highlight">
                {suggestion.substring(startIndex, endIndex)}
              </span>
              {suggestion.substring(endIndex)}
            </li>
          );
        })}
      </ul>
    ) : (
      <div className="no-suggestions">
        {debouncedSearchTerm && filteredSuggestions.length === 0 ? (
          <span>No suggestions, keep typing</span>
        ) : (
          <span>Start typing to search</span>
        )}
      </div>
    );
  };

  return (
    <div className="autocomplete">
      <input
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={userInput}
      />
      <SuggestionsListComponent />
    </div>
  );
};

export default Autocomplete;
