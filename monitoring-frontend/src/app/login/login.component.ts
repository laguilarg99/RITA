import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, 
            MatFormFieldModule, 
            MatInputModule, 
            MatButtonModule, 
            MatIconModule,
            MatCardModule,
            MatButtonModule],
            
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  apiService: ApiService = inject(ApiService)
  registerFormBuilder: FormBuilder = inject(FormBuilder)
  router: Router = inject(Router)
  storageService: StorageService = inject(StorageService);
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
    this.apiService.loginUser(<string>this.registerForm.value.username,<string>this.registerForm.value.password).subscribe({
      next:(response) => {
        this.storageService.saveUser(response.id);
        this.router.navigate(["/home"]);
      },
      error: (e) => {
        console.log(e)
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

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

}
