const buttonClass= {"btn btn-primary": "Primary",
"btn btn-secondary": "Secondary",
"btn btn-success": "Success",
"btn btn-danger": "Danger",
"btn btn-warning": "Warning",
"btn btn-info": "Info",
"btn btn-light": "Light",
"btn btn-dark": "Dark",
"btn btn-link": "Link"}

export default function Button() {
  return (
    <>
      {Object.entries(buttonClass).map(([className, label], index) =>
      <button key={index} type="button" className={className}>
        {label}
      </button>)}
    </>
  )
}
