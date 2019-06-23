namespace DatingApp.API.Helpers
{
    public class PaginationHeader
    {
        public int CurrentPage {get; set;}
        public int ItemPerPage {get; set;}
        public int TotalItems {get; set;}
        public int TotalPages {get; set;}
        
        public PaginationHeader(int currentPage , int itemsPerPage , int totalItems , int totalpages)
        {
            this.CurrentPage = currentPage;
            this.ItemPerPage = itemsPerPage;
            this.TotalItems = totalItems;
            this.TotalPages = totalpages;
        }
    }
}