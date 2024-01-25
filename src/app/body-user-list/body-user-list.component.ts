// Import styles
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../Service/user.service';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

const apiUrl = 'http://localhost:3000';

interface Participant {
  Salutation: string;
  'First Name': string;
  'Last Name': string;
  Age: number;
  'E-Mail': string;
  Country: string;
  Category: string;
  Status: string;
  'Mobile Number': string;
  'T-Shirt Size': string;
  CheckIn: boolean;
}


@Component({
  selector: 'app-body-user-list',
  templateUrl: './body-user-list.component.html',
  styleUrls: ['./body-user-list.component.css']
})

// Define the component
export class BodyUserListComponent implements OnInit{

  // Declare variables for search functionality
  searchTerm: string = '';
  filteredParticipants: Participant[] = []; // Array to store the filtered participants
  users: any[] = []; // Array to store the users
  participants: any[] = []; // Array to store the users
  filteredUsers: any[] = []; // Array to store the filtered users
  searchControl = new FormControl();

  

  // Inject HttpClient into the component through the constructor
  constructor(private http: HttpClient,  private userService: UserService) { }

  // ngOnInit is a lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
  ngOnInit() {
    // this.getAllParticipants(); // Call the method when the component is initialized
    // this.searchControl.valueChanges.subscribe(searchTerm => {
    //   this.filteredParticipants = this.participants.filter(participant =>
    //     participant['First Name'].toLowerCase().includes(searchTerm.toLowerCase()) 
    //   );
    // });
    this.getAllParticipants(); // Call the method when the component is initialized

    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterParticipants(value))
      )
      .subscribe(value => this.filteredParticipants = value);
  }

  // Method to get all participants
  getAllParticipants() { 
    this.userService.getAllParticipants().subscribe(data => {
      this.participants = data.map(participant => ({
        Salutation: participant.Salutation,
        'First Name': participant['First Name'],
        'Last Name': participant['Last Name'],
        Age: participant.Age,
        'E-Mail': participant['E-Mail'],
        Country: participant.Country,
        Category: participant.Category,
        Status: participant.Status,
        'Mobile Number': participant['Mobile Number'],
        'T-Shirt Size': participant['T-Shirt Size'],
        CheckIn: participant.CheckIn
      }));
      this.filteredParticipants = this.participants;
    });
  }

  private _filterParticipants(value: string): Participant[] {
    const filterValue = value.toLowerCase();

    return this.participants.filter(participant =>
      participant['First Name'].toLowerCase().includes(filterValue) 
    );
  }

  toggleCheckIn(participant: Participant) {
    participant.CheckIn = !participant.CheckIn;
  }


  // Method to create a new user
  createUser(name: string, password: string) {
    // Make a POST request to the API with the user data and subscribe to the response
    this.http.post('http://localhost:3000/users/create', { name, password }).subscribe(data => {
      // Log the data returned by the API to the console
      console.log(data);
    });
  }

  // Method to update an existing user
  updateUser(id: string, name: string, password: string) {
    // Make a PUT request to the API with the user ID and new data and subscribe to the response
    this.http.put(`http://localhost:3000/users/update${id}`, { name, password }).subscribe(data => {
      // Log the data returned by the API to the console
      console.log(data);
    });
  }

  // Method to delete a user
  deleteUser(id: string) {
    // Make a DELETE request to the API with the user ID and subscribe to the response
    this.http.delete(`http://localhost:3000/users${id}`).subscribe(data => {
      // Log the data returned by the API to the console
      console.log(data);
    });
  }

}

export class BodyUserListModule { 
  
}
