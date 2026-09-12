export type Specialty = 'Residential' | 'Interiors' | 'Hospitality' | 'Sustainable design' | 'Architecture';
export interface Architect { slug:string; name:string; location:string; specialty:Specialty; rating:number; reviews:number; image:string; founded:number; years:number; description:string; }
export interface Project { title:string; location:string; year:number; image:string; }
export interface Review { quote:string; author:string; project:string; year:number; }
