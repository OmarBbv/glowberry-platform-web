import React, { useState, useRef, useEffect } from 'react';
import { Search as SearchIcon, X, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

type FormValues = {
  inputValue: string;
};

export const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const { register, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      inputValue: '',
    },
  });

  const inputValue = watch('inputValue');

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['/get/search/products', inputValue],
    queryFn: () => productService.getProductSearch(inputValue),
    enabled: false,
  });

  const searchProduct = data?.data;

  const onSubmit = (data: FormValues) => {
    setIsOpen(false);
    console.log('Search submitted:', data.inputValue);
  };

  const handleClearSearch = () => {
    reset();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearchClick = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearchSubmit = (productId: string) => {
    setIsOpen(false);
    reset();
    router.push(`/mehsullar/${productId}`);
  };

  const handleRouterSearch = () => {
    router.push('/axtaris');
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!inputValue || inputValue.trim() === '') {
      setIsTyping(false);
      return;
    }

    setIsTyping(true);

    const handler = setTimeout(() => {
      setIsTyping(false);
      refetch();
    }, 2000);

    return () => clearTimeout(handler);
  }, [inputValue, refetch]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isMobile && isOpen) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center p-4 border-b">
          <button onClick={() => setIsOpen(false)} className="mr-3 p-1">
            <X className="w-6 h-6 text-gray-600" />
          </button>
          <form className="flex-1 relative" onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register('inputValue')}
              ref={(e) => {
                register('inputValue').ref(e);
                inputRef.current = e;
              }}
              type="text"
              placeholder="Найти на Wildberries"
              className="w-full p-3 bg-gray-50 rounded-lg outline-none text-lg"
              autoFocus
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </form>
        </div>

        {/* Mobile SearchIcon Content */}
        <div className="flex-1 overflow-auto p-4">
          {/* Popular Searches */}
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-4 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              {isTyping || isFetching
                ? 'Axtarılır...'
                : inputValue && searchProduct?.length
                ? 'Axtarış nəticələri'
                : 'Populyar axtarışlar'}
            </h3>
            <div className="space-y-3">
              {(isTyping || isFetching) && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500 mr-2"></div>
                  <span className="text-gray-500 text-sm">Axtarılır...</span>
                </div>
              )}
              {!isTyping &&
                !isFetching &&
                searchProduct?.map(
                  (search: ISearchProductItem, index: number) => (
                    <button
                      key={search.id}
                      onClick={() => handleSearchSubmit(String(search.id))}
                      className="flex items-center w-full text-left p-2 hover:bg-gray-50 rounded-lg"
                    >
                      <SearchIcon className="w-4 h-4 text-gray-400 mr-3" />
                      <div className="flex flex-col items-start">
                        <span className="text-gray-700 font-medium">
                          {search.title}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {search.companyName}
                        </span>
                      </div>
                    </button>
                  )
                )}
              {!isTyping &&
                !isFetching &&
                !searchProduct?.length &&
                inputValue && (
                  <div className="text-center text-gray-500 py-4">
                    Heç bir nəticə tapılmadı
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative z-40" ref={searchRef}>
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <input
          {...register('inputValue')}
          ref={(e) => {
            register('inputValue').ref(e);
            inputRef.current = e;
          }}
          type="text"
          placeholder={isMobile ? 'Axtarış...' : 'Məhsul axtarın...'}
          onClick={handleSearchClick}
          onFocus={() => setIsOpen(true)}
          className="w-full relative z-40 p-2 lg:py-4 lg:px-4 bg-white rounded-xl outline-none pr-20 border border-gray-200 focus:border-purple-300 transition-colors"
          autoComplete="off"
        />

        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="text-gray-400 w-5 h-5" />
            </button>
          )}
          <button type="submit" className="p-2 hover:bg-gray-100 rounded-lg">
            <SearchIcon className="text-gray-400 w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Desktop Dropdown */}
      {!isMobile && isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 w-full h-dvh bg-black/30"
          />
          <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-200 mt-2 max-h-96 overflow-auto">
            <div className="p-4">
              {/* Popular Searches Desktop */}
              <div>
                <div className="flex justify-between">
                  <h3 className="text-gray-500 text-sm font-medium mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {isTyping || isFetching
                      ? 'Axtarılır...'
                      : inputValue && searchProduct?.length
                      ? 'Axtarış nəticələri'
                      : 'Populyar axtarışlar'}
                  </h3>
                  <button
                    onClick={handleRouterSearch}
                    className="text-xs hover:underline cursor-pointer"
                  >
                    Hamisina bax
                  </button>
                </div>
                <div className="space-y-2">
                  {(isTyping || isFetching) && (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                      <span className="text-gray-500 text-sm">
                        Axtarılır...
                      </span>
                    </div>
                  )}
                  {!isTyping &&
                    !isFetching &&
                    searchProduct?.map((search: ISearchProductItem) => (
                      <button
                        key={search.id}
                        onClick={() => handleSearchSubmit(String(search.id))}
                        className="flex items-center w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <SearchIcon className="w-4 h-4 text-gray-400 mr-3" />
                        <div className="flex flex-col items-start">
                          <span className="text-gray-700 font-medium">
                            {search.title}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {search.companyName}
                          </span>
                        </div>
                      </button>
                    ))}
                  {!isTyping &&
                    !isFetching &&
                    !searchProduct?.length &&
                    inputValue && (
                      <div className="text-center text-gray-500 py-4">
                        Heç bir nəticə tapılmadı
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
