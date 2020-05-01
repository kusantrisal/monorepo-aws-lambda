import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { HttpService } from "../service/http/http.service";
import { Router } from "@angular/router";
import { ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material/sidenav';
import { BlockScrollStrategy } from '@angular/cdk/overlay';

export interface Section {
  name: string;
  updated: Date;
  image?: string
}

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  "maroon",
  "red",
  "orange",
  "yellow",
  "olive",
  "green",
  "purple",
  "fuchsia",
  "lime",
  "teal",
  "aqua",
  "blue",
  "navy",
  "black",
  "gray"
];
const NAMES: string[] = [
  "Maia",
  "Asher",
  "Olivia",
  "Atticus",
  "Amelia",
  "Jack",
  "Charlotte",
  "Theodore",
  "Isla",
  "Oliver",
  "Isabella",
  "Jasper",
  "Cora",
  "Levi",
  "Violet",
  "Arthur",
  "Mia",
  "Thomas",
  "Elizabeth"
];

@Component({
  selector: "app-secure",
  templateUrl: "./secure.component.html",
  styleUrls: ["./secure.component.css"]
})
export class SecureComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('drawer') drawer: MatSidenav;
  @ViewChild('showMe') showMe: any;

  private mediaSub: Subscription;
  constructor(private httpService: HttpService, private router: Router, private cdRef: ChangeDetectorRef, private mediaObserver: MediaObserver) {
    // Create 100 users
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }
  value;
  displayedColumns: string[] = ["id", "name", "progress", "color"];
  dataSource: MatTableDataSource<UserData>;

  response: any;
  showFiller = false;
  folders: Section[] = [
    {
      name: "Photos",
      updated: new Date()
    },
    {
      name: "Recipes",
      updated: new Date("1/17/16")
    },
    {
      name: "Work",
      updated: new Date("1/28/16")
    }
  ];
  notes: Section[] = [
    {
      name: "Vacation Itinerary",
      updated: new Date("2/20/16"),
      image: "https://hdwallsource.com/img/2019/6/lamborghini-urus-interior-hd-wallpaper-66517-68785-hd-wallpapers.jpg"
    },
    {
      name: "Kitchen Remodel",
      updated: new Date("1/18/16"),
      image: "https://hdwallsource.com/img/2019/6/lamborghini-urus-interior-hd-wallpaper-66517-68785-hd-wallpapers.jpg"
    },
    {
      name: "Vacation Itinerary",
      updated: new Date("2/20/16"),
      image: "https://hdwallsource.com/img/2019/6/lamborghini-urus-interior-hd-wallpaper-66517-68785-hd-wallpapers.jpg"
    },
    {
      name: "Kitchen Remodel",
      updated: new Date("1/18/16"),
      image: "https://hdwallsource.com/img/2019/6/lamborghini-urus-interior-hd-wallpaper-66517-68785-hd-wallpapers.jpg"
    },
    {
      name: "Vacation Itinerary",
      updated: new Date("2/20/16"),
      image: "https://hdwallsource.com/img/2019/6/lamborghini-urus-interior-hd-wallpaper-66517-68785-hd-wallpapers.jpg"
    },
    {
      name: "Kitchen Remodel",
      updated: new Date("1/18/16"),
      image: "https://hdwallsource.com/img/2019/6/lamborghini-urus-interior-hd-wallpaper-66517-68785-hd-wallpapers.jpg"
    },
    {
      name: "Vacation Itinerary",
      updated: new Date("2/20/16"),
      image: "https://hdwallsource.com/img/2019/6/lamborghini-urus-interior-hd-wallpaper-66517-68785-hd-wallpapers.jpg"
    },
    {
      name: "Kitchen Remodel",
      updated: new Date("1/18/16"),
      image: "https://hdwallsource.com/img/2019/6/lamborghini-urus-interior-hd-wallpaper-66517-68785-hd-wallpapers.jpg"
    },
    {
      name: "Vacation Itinerary",
      updated: new Date("2/20/16"),
      image: "https://hdwallsource.com/img/2019/6/lamborghini-urus-interior-hd-wallpaper-66517-68785-hd-wallpapers.jpg"
    },
    {
      name: "Kitchen Remodel",
      updated: new Date("1/18/16"),
      image: "https://hdwallsource.com/img/2019/6/lamborghini-urus-interior-hd-wallpaper-66517-68785-hd-wallpapers.jpg"
    },
    {
      name: "Vacation Itinerary",
      updated: new Date("2/20/16"),
      image: "https://hdwallsource.com/img/2019/6/lamborghini-urus-interior-hd-wallpaper-66517-68785-hd-wallpapers.jpg"
    },
    {
      name: "Kitchen Remodel",
      updated: new Date("1/18/16"),
      image: "https://hdwallsource.com/img/2019/6/lamborghini-urus-interior-hd-wallpaper-66517-68785-hd-wallpapers.jpg"
    }
  ];

  ngOnInit(): void {
    this.mediaSub = this.mediaObserver.asObservable().subscribe(
      change => {
        change.forEach((v) => {
          console.log("==============")
          console.log(v.mqAlias);
          console.log(v.mediaQuery);
          if (!v.mqAlias.match('lt-sm|xs')) {
            this.drawer.close();
          } else {
            this.drawer.open();
          }
        });
      });


    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // this.httpService.getUser().subscribe(
    //   res => {
    //     console.log('response from secure api')
    //     console.log(res);
    //     this.response = res;
    //   },
    //   err => {
    //     this.router.navigate(["/signin"]);
    //   }
    // );
  }

  ngOnDestroy(): void {
    if (this.mediaSub) {
      this.mediaSub.unsubscribe();
    }
  }

  addFolder(value) {
    this.folders.push({
      name: value,
      updated: new Date()
    });
    this.folders = this.folders.sort(
      (a, b) => b.updated.getTime() - a.updated.getTime()
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  originalFolders = this.folders;
  applyFilterOnSideNav(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.folders = this.folders.filter(item =>
      item.name.toLowerCase().includes(filterValue.trim().toLowerCase())
    );

    if (filterValue == null || filterValue === "") {
      this.folders = this.originalFolders;
    }
  }

  displayFolderContent(index, selection) {
    console.log(index);
    console.log(selection);
    this.showMe.nativeElement.hidden = true;
    console.log(this.showMe);
    // this.showMe.style.display === 'none';
  }

}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    " " +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    ".";

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };


}

