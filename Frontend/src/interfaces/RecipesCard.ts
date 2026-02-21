export default interface RecipesCard {
  id?: number | string;
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  isLiked?: boolean;
  category?: string;
}
