import React, { useState, useRef, useEffect } from 'react';
import {
  Search as SearchIcon,
  X,
  Clock,
  TrendingUp,
  Filter,
} from 'lucide-react';

export const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Mock data - gerçek uygulamada API'den gelecek
  const recentSearches = ['minecraft', '300762192', '17386353'];
  const popularSearches = [
    'футболка женская',
    'купальник женский раздельный',
    'футболка мужская',
    'платье женское летнее',
    'лабубу',
    'босоножки женские летние',
    'трусы женские',
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchClick = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef?.current?.focus();
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const removeRecentSearch = (searchTerm: any) => {
    // Mock function - gerçek uygulamada API call yapılacak
    console.log('Removing recent search:', searchTerm);
  };

  const handleSearchSubmit = (term: any) => {
    setSearchValue(term);
    setIsOpen(false);
    // SearchIcon API call burada yapılacak
    console.log('Searching for:', term);
  };

  if (isMobile && isOpen) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center p-4 border-b">
          <button onClick={() => setIsOpen(false)} className="mr-3 p-1">
            <X className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Найти на Wildberries"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-lg outline-none text-lg"
              autoFocus
            />
            {searchValue && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile SearchIcon Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-8">
              <h3 className="text-gray-500 text-sm font-medium mb-4 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Вы искали
              </h3>
              <div className="space-y-3">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <button
                      onClick={() => handleSearchSubmit(search)}
                      className="flex items-center flex-1 text-left"
                    >
                      <Clock className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">{search}</span>
                    </button>
                    <button
                      onClick={() => removeRecentSearch(search)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-4 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Часто ищут
            </h3>
            <div className="space-y-3">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchSubmit(search)}
                  className="flex items-center w-full text-left p-2 hover:bg-gray-50 rounded-lg"
                >
                  <SearchIcon className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative z-40" ref={searchRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={isMobile ? 'Axtarış...' : 'Məhsul axtarın...'}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onClick={handleSearchClick}
          onFocus={() => setIsOpen(true)}
          className="w-full p-2 lg:py-4 lg:px-4 bg-white rounded-xl outline-none pr-20 border border-gray-200 focus:border-purple-300 transition-colors"
        />

        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchValue && (
            <button
              onClick={handleClearSearch}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="text-gray-400 w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={handleSearchClick}
          >
            <SearchIcon className="text-gray-400 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Dropdown */}
      {!isMobile && isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-200 mt-2 max-h-96 overflow-auto">
          <div className="p-4">
            {/* Recent Searches Desktop */}
            {recentSearches.length > 0 && (
              <div className="mb-6">
                <h3 className="text-gray-500 text-sm font-medium mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Son axtarışlar
                </h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg"
                    >
                      <button
                        onClick={() => handleSearchSubmit(search)}
                        className="flex items-center flex-1 text-left"
                      >
                        <Clock className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-700">{search}</span>
                      </button>
                      <button
                        onClick={() => removeRecentSearch(search)}
                        className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 rounded"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches Desktop */}
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Populyar axtarışlar
              </h3>
              <div className="space-y-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchSubmit(search)}
                    className="flex items-center w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <SearchIcon className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
