import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

export interface post {
  date: Date;
  subject: string;
  content: string;
  photo: File;
}

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  preview: string;
  formGroup = this.fb.group({
    date: [Date.now, Validators.required],
    subject: [null, Validators.required],
    content: [null, Validators.required],
    photo: [null, Validators.required]
  });

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  submitForm() {
    console.log(this.formGroup.value)
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.formGroup.patchValue({
      photo: file
    });
    this.formGroup.get('photo').updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    }
    reader.readAsDataURL(file)
  }
}
