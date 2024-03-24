import { Component } from '@angular/core';
import { HomeService } from './home.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 constructor(private hs: HomeService) { }

 ngOnInit(){

 }

  title = 'home';
  obj = { firstname: '', lastname: '', numberOfWheels:'2',selectedVehicleType: '', selectedVehicleModel: '',startDate:'', endDate:''};
  level = 1;
  submitted = true;

  onSubmit() {
    if (this.level === 5) {
      console.log('Form data:', this.obj);
      this.submitted = false;
      this.level = 1;
      this.hs.postData(this.obj).subscribe(response=>{

      })
    }
    if(this.obj.firstname && this.obj.lastname){
      
      if(this.obj.numberOfWheels){

        if(this.obj.selectedVehicleType){

          if(this.obj.selectedVehicleModel){

            if(this.obj.startDate && this.obj.endDate){
              this.hs.postData(this.obj).subscribe(resp=>{
                
              })
            } else {
              this.level = 5;
            }
          }else{
            this.level = 4;
          }
        } else{
          this.level = 3;
        }
      }else{
        this.level = 2;
      }

    }

  }

  getData() {
    // this.hs.getData().subscribe(
    //   response => {
    //     console.log('Data:', response);
    //     // Handle the response data as needed
    //   },
    //   error => {
    //     console.error('Error:', error);
    //     // Handle any errors that occur during the HTTP request
    //   }
    // );
  }
}

