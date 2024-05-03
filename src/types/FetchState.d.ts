type FetchState<T> = {
    data: T;
    url: string;
    error: boolean;
    isLoading: boolean;
};