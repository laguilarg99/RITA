import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,
            MatFormFieldModule, 
            MatInputModule, 
            MatButtonModule, 
            MatIconModule,
            MatCardModule,
            MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})


export class RegisterComponent {
  apiService: ApiService = inject(ApiService)
  registerFormBuilder: FormBuilder = inject(FormBuilder)
  storageService: StorageService = inject(StorageService);
  router: Router = inject(Router)
  isLoggedIn: boolean = false;
  hide: boolean = true;
  error: any;

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.router.navigate(['/home']);
    }
  }

  registerForm = this.registerFormBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })

  submitForm() {
    this.apiService.registerUser(<string>this.registerForm.value.username,<string>this.registerForm.value.password).subscribe({
      next:(response) => {
        if(response.id === "") {
          this.error = "User already exists."
        }else{
          this.router.navigate(["/login"])
        }
      },
      error: (e) => {
        switch (e.status) {
          case 400:
            this.error = "Bad Request";
            break;
          case 401:
            this.error = "Invalid credentials";
            break;
          case 403:
            this.error = "Forbidden";
            break;
          case 404:
            this.error = "Not Found";
            break;
          case 500:
            this.error = "Internal Server Error";
            break;
          default:
            this.error = "Unknown Error";
            break;
        }
      }
    })
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
