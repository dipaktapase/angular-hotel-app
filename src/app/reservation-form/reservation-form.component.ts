import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css'],
})
export class ReservationFormComponent implements OnInit {
  reservationForm: FormGroup = new FormGroup({});

  // constructor is a method that get started or invoked when you create an instance of a class
  constructor(
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // that's how we group together multiple controls
    this.reservationForm = this.formBuilder.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guestName: ['', [Validators.required, Validators.minLength(3)]],
      guestEmail: ['', [Validators.required, Validators.email]],
      roomNumber: ['', Validators.required],
    });

    // To retrieves the value of a route parameter named id from the URL.
    // To access specific dynamic parts of the URL (e.g., /edit/:id)
    // for operations like fetching or modifying data related to that parameter.
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('idd', id);

    if (id) {
      let reservation = this.reservationService.getReservation(id);

      console.log('reservation', reservation);
      // this.reservationForm.patchValue(reservation!) // We use a non-null assertion (!) or check if it's defined
      // OR
      if (reservation) {
        this.reservationForm.patchValue(reservation);
      }
    }
  }

  onSubmit() {
    if (this.reservationForm.valid) {
      // console.log('valid');
      let reservation: Reservation = this.reservationForm.value;

      let id = this.activatedRoute.snapshot.paramMap.get('id');

      if (id) {
        // Update
        this.reservationService.updateReservation(id, reservation);
      } else {
        // New
        this.reservationService.addReservation(reservation);
      }

      // To navigate user from form page to list page when he clicks submit button
      // here we use router.navigate to go /list
      this.router.navigate(['/list']);
    }
  }
}
