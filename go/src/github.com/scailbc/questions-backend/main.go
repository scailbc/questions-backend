package main
import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/scailbc/questions-backend/db"
	"github.com/scailbc/questions-backend/db/connection"
	"net/http"
	"os"
	"time"
)

type HomeResponse struct {
	Name string `json:"name"`
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	var response = HomeResponse{Name: "Go Questions Backend"}
	responseJson, _ := json.Marshal(response)
    w.Write(responseJson)
}

func main() {
	// Connect to database
	dbconnection.Connect()
	defer dbconnection.Close()

	dbconnection.InitTables(db.DB);

	// Create router
	r := mux.NewRouter()
	r.StrictSlash(true)

	r.HandleFunc("/", HomeHandler).Methods("GET")

	url := ""
	port := os.Getenv("PORT")

	fmt.Println(fmt.Sprintf("Start server on %s:%s", url, port))

	srv:= &http.Server{
		Handler: r,
		Addr: fmt.Sprintf("%s:%s", url, port),
		WriteTimeout: 15 * time.Second, 
		ReadTimeout: 15 * time.Second, 
	}

	srv.ListenAndServe()
}