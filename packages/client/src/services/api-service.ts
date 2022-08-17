import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios'
import { defer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SESSION_TOKEN_KEY } from '../constants/storage';

class ApiService {
    private static _instance: ApiService;
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
        });
    }

    static get instance() {
        if (!this._instance) this._instance = new this();
        return this._instance;
    }

    get = <T>(url: string, queryParams?: object): Observable<T> => {
        return defer(()=> this.api.get<T>(url, { params: queryParams, headers: { ...this.getAuthHeader() } }))
            .pipe(map(result => result.data));
    };
    
    post = <T>(url: string, body: object = {}, queryParams?: object): Observable<T> => {
        return defer(()=> this.api.post<T>(url, body, { params: queryParams, headers: { ...this.getAuthHeader() } }))
            .pipe(map(result => result.data));
    };
    
    put = <T>(url: string, body: object = {}, queryParams?: object): Observable<T> => {
        return defer(()=>this.api.put<T>(url, body, { params: queryParams, headers: { ...this.getAuthHeader() } }))
            .pipe(map(result => result.data));
    };
    
    patch = <T>(url: string, body: object = {}, queryParams?: object): Observable<T> => {
        return defer(()=> this.api.patch<T>(url, body, { params: queryParams, headers: { ...this.getAuthHeader() } }))
            .pipe(map(result => result.data));
    };
    
    delete = <T>(url: string): Observable<T> => {
        return defer(() => (this.api.delete(url, { headers: { ...this.getAuthHeader() } })))
            .pipe(map(result => result.data)
        );
    };
    
    private getAuthHeader(): AxiosRequestHeaders {
        const token = window.localStorage.getItem(SESSION_TOKEN_KEY);

        if (!token) return {}
        else return {
            Authorization: `Bearer ${token}`,
        };
    }
}

const apiService = ApiService.instance;

export { apiService, ApiService }