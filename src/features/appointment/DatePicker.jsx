export default function DatePicker({

    value,
    
    onChange
    
    }){
    
    
    return (
    
    <div>
    
    
    <label>
    Select Date
    </label>
    
    
    <input
    
    type="date"
    
    value={value}
    
    onChange={(e)=>
    onChange(e.target.value)
    }
    
    />
    
    
    </div>
    
    )
    
    }