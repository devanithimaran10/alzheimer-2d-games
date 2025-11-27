import React, { useState } from "react";
import GameLayout from "./GameLayout";
import { useCognitiveScore } from "../../contexts/CognitiveScoreContext";
import "./GroceryAisle.css";

const GroceryAisle = () => {
  const categories = [
    {
      name: "Fruit",
      emoji: "🍎",
      color: "#ff6b6b",
      items: [
        { id: 1, name: "Apple", emoji: "🍎" },
        { id: 2, name: "Banana", emoji: "🍌" },
        { id: 3, name: "Orange", emoji: "🍊" },
        { id: 4, name: "Grapes", emoji: "🍇" },
      ],
    },
    {
      name: "Tools",
      emoji: "🔧",
      color: "#4ecdc4",
      items: [
        { id: 5, name: "Hammer", emoji: "🔨" },
        { id: 6, name: "Wrench", emoji: "🔧" },
        { id: 7, name: "Screwdriver", emoji: "🪛" },
        { id: 8, name: "Saw", emoji: "🪚" },
      ],
    },
    {
      name: "Vegetables",
      emoji: "🥕",
      color: "#95e1d3",
      items: [
        { id: 9, name: "Carrot", emoji: "🥕" },
        { id: 10, name: "Broccoli", emoji: "🥦" },
        { id: 11, name: "Tomato", emoji: "🍅" },
        { id: 12, name: "Pepper", emoji: "🫑" },
      ],
    },
    {
      name: "Clothing",
      emoji: "👕",
      color: "#f38181",
      items: [
        { id: 13, name: "Shirt", emoji: "👕" },
        { id: 14, name: "Pants", emoji: "👖" },
        { id: 15, name: "Hat", emoji: "🧢" },
        { id: 16, name: "Shoes", emoji: "👞" },
      ],
    },
  ];

  const [availableItems, setAvailableItems] = useState(() => {
    const allItems = categories.flatMap((cat) => cat.items);
    return [...allItems].sort(() => Math.random() - 0.5);
  });

  const [categoryItems, setCategoryItems] = useState(
    categories.reduce((acc, cat) => {
      acc[cat.name] = [];
      return acc;
    }, {})
  );

  const { updateGameScore } = useCognitiveScore();
  const [draggedItem, setDraggedItem] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [correctItems, setCorrectItems] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDrop = (categoryName) => {
    if (!draggedItem) return;

    const category = categories.find((cat) => cat.name === categoryName);
    const isCorrect = category.items.find((item) => item.id === draggedItem.id);

    setTotalItems((prev) => {
      const newTotal = prev + 1;
      setCorrectItems((prevCorrect) => {
        const newCorrect = isCorrect ? prevCorrect + 1 : prevCorrect;
        const accuracy = newCorrect / newTotal;
        updateGameScore("groceryAisle", accuracy);
        return newCorrect;
      });
      return newTotal;
    });

    if (isCorrect) {
      // Correct category
      setCategoryItems({
        ...categoryItems,
        [categoryName]: [...categoryItems[categoryName], draggedItem],
      });
      setAvailableItems(
        availableItems.filter((item) => item.id !== draggedItem.id)
      );
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    } else {
      // Wrong category - bounce back gently
      setDraggedItem(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClickItem = (item) => {
    setDraggedItem(item);
  };

  const handleClickCategory = (categoryName) => {
    if (draggedItem) {
      handleDrop(categoryName);
      setDraggedItem(null);
    }
  };

  const reset = () => {
    const allItems = categories.flatMap((cat) => cat.items);
    setAvailableItems([...allItems].sort(() => Math.random() - 0.5));
    setCategoryItems(
      categories.reduce((acc, cat) => {
        acc[cat.name] = [];
        return acc;
      }, {})
    );
    setDraggedItem(null);
    setCorrectItems(0);
    setTotalItems(0);
  };

  const allSorted = availableItems.length === 0;

  return (
    <GameLayout title="Grocery Aisle Sorter">
      <div className="grocery-aisle">
        <div className="instructions">
          <p>
            Drag items into the correct category, or click an item then click a
            category
          </p>
        </div>

        <div className="categories-container">
          {categories.map((category) => (
            <div
              key={category.name}
              className="category-box"
              style={{ borderColor: category.color }}
              onDrop={() => handleDrop(category.name)}
              onDragOver={handleDragOver}
              onClick={() => handleClickCategory(category.name)}
            >
              <div
                className="category-header"
                style={{ backgroundColor: category.color }}
              >
                <span className="category-emoji">{category.emoji}</span>
                <h3>{category.name}</h3>
              </div>
              <div className="category-items">
                {categoryItems[category.name].map((item) => (
                  <div key={item.id} className="sorted-item">
                    <span className="item-emoji">{item.emoji}</span>
                    <span className="item-name">{item.name}</span>
                  </div>
                ))}
                {categoryItems[category.name].length === 0 && (
                  <div className="drop-zone">Drop items here</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="available-items-container">
          <h3>Items to Sort:</h3>
          <div className="available-items">
            {availableItems.map((item) => (
              <div
                key={item.id}
                className={`item-card ${
                  draggedItem?.id === item.id ? "selected" : ""
                }`}
                draggable
                onDragStart={() => handleDragStart(item)}
                onClick={() => handleClickItem(item)}
              >
                <div className="item-emoji">{item.emoji}</div>
                <div className="item-name">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {showSuccess && <div className="success-feedback">✓ Correct!</div>}

        {allSorted && (
          <div className="completion-message">
            <h2>🎉 Excellent! You sorted everything correctly!</h2>
            <button className="reset-button" onClick={reset}>
              Play Again
            </button>
          </div>
        )}

        <button className="reset-button" onClick={reset}>
          Reset
        </button>
      </div>
    </GameLayout>
  );
};

export default GroceryAisle;
